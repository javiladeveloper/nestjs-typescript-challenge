import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateOrderDto } from '../../controllers/order/dto/create-order.dto';
import { UpdateOrderDto } from '../../controllers/order/dto/update-order.dto';
import { Customer } from '../../models/customer.entity';
import { Order } from '../../models/order.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(@InjectRepository(Order) private repository: Repository<Order>) {
    this.logger.log('OrderService initialized');
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Order>> {
    this.logger.log('Fetching all orders');
    const orders = await paginate<Order>(this.repository, options, {
      relations: ['agentCode', 'custCode'],
    });
    this.logger.log(`Fetched ${orders.items.length} orders`);
    return orders;
  }

  async findOneById(ordNum: number): Promise<Order | undefined> {
    this.logger.log(`Fetching order details for ID: ${ordNum}`);
    const order = await this.repository.findOne({
      where: { ordNum },
      relations: ['agentCode', 'custCode'],
    });
    this.logger.log('Order details fetched', JSON.stringify(order));
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log('Creating a new order', JSON.stringify(createOrderDto));
    const order: Order = this.repository.create(createOrderDto);
    const savedOrder = await this.repository.save(order);
    this.logger.log(`Order created successfully with ID: ${savedOrder.ordNum}`);
    return savedOrder;
  }

  async update(
    ordNum: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateResult> {
    this.logger.log(
      `Updating order with ID: ${ordNum}`,
      JSON.stringify(updateOrderDto),
    );
    const result = await this.repository.update(ordNum, updateOrderDto);
    this.logger.log(`Order updated successfully with ID: ${ordNum}`);
    return result;
  }

  async delete(ordNum: number): Promise<DeleteResult> {
    this.logger.log(`Deleting order with ID: ${ordNum}`);
    const result = await this.repository.delete(ordNum);
    this.logger.log(`Order deleted successfully with ID: ${ordNum}`);
    return result;
  }

  async totalAmountByCustomer(): Promise<any> {
    this.logger.log('Calculating total amount by customer');
    const result = await this.repository
      .createQueryBuilder('orders')
      .select('orders.cust_code', 'custCode')
      .addSelect('SUM(orders.ord_amount)', 'totalOrdAmount')
      .groupBy('orders.cust_code')
      .getRawMany();
    this.logger.log(
      'Total amount by customer calculated',
      JSON.stringify(result),
    );
    return result;
  }

  async totalAmountByAgent(): Promise<any> {
    this.logger.log('Calculating total amount by agent');
    const result = await this.repository
      .createQueryBuilder('orders')
      .select('orders.agent_code', 'agentCode')
      .addSelect('SUM(orders.ord_amount)', 'totalOrdAmount')
      .groupBy('orders.agent_code')
      .getRawMany();
    this.logger.log('Total amount by agent calculated', JSON.stringify(result));
    return result;
  }

  async totalAmountByCountry(): Promise<any> {
    this.logger.log('Calculating total amount by country');
    const result = await this.repository
      .createQueryBuilder('orders')
      .leftJoin(Customer, 'customer', 'orders.cust_code = customer.cust_code')
      .select('customer.cust_country', 'custCountry')
      .addSelect('SUM(orders.ord_amount)', 'totalOrdAmount')
      .groupBy('customer.cust_country')
      .getRawMany();
    this.logger.log(
      'Total amount by country calculated',
      JSON.stringify(result),
    );
    return result;
  }
}

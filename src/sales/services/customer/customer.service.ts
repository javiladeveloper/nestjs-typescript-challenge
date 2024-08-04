import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from '../../controllers/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../controllers/customer/dto/update-customer.dto';
import { Customer } from '../../models/customer.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer) private repository: Repository<Customer>,
  ) {
    this.logger.log('CustomerService initialized');
  }

  async findAll(): Promise<Customer[] | undefined> {
    this.logger.log('Fetching all customers');
    const customers = await this.repository.find({
      relations: ['agentCode'],
    });
    this.logger.log(`Fetched ${customers.length} customers`);
    return customers;
  }

  async findOneById(custCode: string): Promise<Customer | undefined> {
    this.logger.log(`Fetching customer details for ID: ${custCode}`);
    const customer = await this.repository.findOne({
      where: { custCode },
      relations: ['agentCode'],
    });
    this.logger.log('Customer details fetched', JSON.stringify(customer));
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    this.logger.log(
      'Creating a new customer',
      JSON.stringify(createCustomerDto),
    );
    const customer: Customer = this.repository.create(createCustomerDto);
    const savedCustomer = await this.repository.save(customer);
    this.logger.log(
      `Customer created successfully with ID: ${savedCustomer.custCode}`,
    );
    return savedCustomer;
  }

  async update(
    custCode: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<UpdateResult> {
    this.logger.log(
      `Updating customer with ID: ${custCode}`,
      JSON.stringify(updateCustomerDto),
    );
    const result = await this.repository.update(custCode, updateCustomerDto);
    this.logger.log(`Customer updated successfully with ID: ${custCode}`);
    return result;
  }

  async delete(custCode: string): Promise<DeleteResult> {
    this.logger.log(`Deleting customer with ID: ${custCode}`);
    const result = await this.repository.delete(custCode);
    this.logger.log(`Customer deleted successfully with ID: ${custCode}`);
    return result;
  }
}

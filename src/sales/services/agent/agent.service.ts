import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAgentDto } from '../../controllers/agent/dto/create-agent.dto';
import { UpdateAgentDto } from '../../controllers/agent/dto/update-agent.dto';
import { Agent } from '../../models/agent.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(@InjectRepository(Agent) private repository: Repository<Agent>) {
    this.logger.log('AgentService initialized');
  }

  async findAll(): Promise<Agent[] | undefined> {
    this.logger.log('Fetching all agents');
    const agents = await this.repository.find();
    this.logger.log(`Fetched ${agents.length} agents`);
    return agents;
  }

  async findOneById(agentCode: string): Promise<Agent | undefined> {
    this.logger.log(`Fetching agent details for ID: ${agentCode}`);
    const agent = await this.repository.findOne({
      where: { agentCode },
      relations: ['customers'],
    });
    this.logger.log('Agent details fetched', JSON.stringify(agent));
    return agent;
  }

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    this.logger.log('Creating a new agent', JSON.stringify(createAgentDto));
    const agent: Agent = this.repository.create(createAgentDto);
    const savedAgent = await this.repository.save(agent);
    this.logger.log(
      `Agent created successfully with ID: ${savedAgent.agentCode}`,
    );
    return savedAgent;
  }

  async update(
    agentCode: string,
    updateAgentDto: UpdateAgentDto,
  ): Promise<UpdateResult> {
    this.logger.log(
      `Updating agent with ID: ${agentCode}`,
      JSON.stringify(updateAgentDto),
    );
    const result = await this.repository.update(agentCode, updateAgentDto);
    this.logger.log(`Agent updated successfully with ID: ${agentCode}`);
    return result;
  }

  async delete(agentCode: string): Promise<DeleteResult> {
    this.logger.log(`Deleting agent with ID: ${agentCode}`);
    const result = await this.repository.delete(agentCode);
    this.logger.log(`Agent deleted successfully with ID: ${agentCode}`);
    return result;
  }
}

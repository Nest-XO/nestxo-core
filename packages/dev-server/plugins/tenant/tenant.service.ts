import { Injectable } from '@nestjs/common';
import { ID, RequestContext, TransactionalConnection } from '@vendure/core';
import { Tenant } from './tenant.entity';
import { Channel } from '@vendure/core/dist/entity/channel/channel.entity';
import { In } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(private connection: TransactionalConnection) {}

  async create(
    ctx: RequestContext,
    input: { name: string; token: string; description?: string; channelIds?: ID[] },
  ): Promise<Tenant> {
    if (!input.token) {
      throw new Error('Tenant token is required');
    }
 
    const tenantRepo = this.connection.getRepository(ctx, Tenant);

    const code = this.slugify(input.name);

    const existingTenant = await tenantRepo.findOne({
      where: [
        { name: input.name },
        { code },
        { token: input.token },
      ],
    });

    if (existingTenant) {
      throw new Error(
        `Tenant already exists with same ${
          existingTenant.name === input.name
            ? 'name'
            : existingTenant.code === code
            ? 'code'
            : 'token'
        }`,
      );
    }

    const tenant = tenantRepo.create({
      name: input.name,
      description: input.description ?? '',
      code,
      token: input.token,
    });

    await tenantRepo.save(tenant);

    if (input.channelIds?.length) {
      await this.addChannelsToTenant(ctx, tenant, input.channelIds);
      await tenantRepo.save(tenant);
    }

    const channelRepo = this.connection.getRepository(ctx, Channel);
    const channels = await channelRepo.find({
      where: { customFields: { tenant: { id: tenant.id } } } as any,
    });
    (tenant as any).channels = channels;

    return tenant;
  }

  async update(
    ctx: RequestContext,
    id: ID,
    input: { name?: string; addChannelIds?: ID[]; removeChannelIds?: ID[] },
  ): Promise<Tenant> {
    const tenant = await this.findOneById(ctx, id);
    if (!tenant) throw new Error('Tenant not found');

    if (input.name) {
      await this.renameTenant(tenant, input.name);
    }

    if (input.addChannelIds?.length) {
      await this.addChannelsToTenant(ctx, tenant, input.addChannelIds);
    }

    if (input.removeChannelIds?.length) {
      await this.removeChannelsFromTenant(ctx, tenant, input.removeChannelIds);
    }

    return this.connection.getRepository(ctx, Tenant).save(tenant);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const tenant = await this.findOneById(ctx, id);
    if (!tenant) return false;

    const channelRepo = this.connection.getRepository(ctx, Channel);

    const channels = await channelRepo.find({
      where: { customFields: { tenant: { id } } } as any,
    });

    for (const channel of channels) {
      (channel as any).customFields.tenant = null;
    }
    await channelRepo.save(channels);

    await this.connection.getRepository(ctx, Tenant).remove(tenant);
    return true;
  }

  async findOneById(ctx: RequestContext, id: ID): Promise<Tenant | null> {
    const tenant = await this.connection
      .getRepository(ctx, Tenant)
      .createQueryBuilder('tenant')
      .where('tenant.id = :id', { id })
      .getOne();

    if (!tenant) return null;

    const channelRepo = this.connection.getRepository(ctx, Channel);
    const channels = await channelRepo.find({
      where: { customFields: { tenant: { id } } } as any,
    });

    (tenant as any).channels = channels;
    return tenant;
  }

  async findOneByCode(ctx: RequestContext, code: string): Promise<Tenant | null> {
    const tenant = await this.connection
      .getRepository(ctx, Tenant)
      .createQueryBuilder('tenant')
      .where('tenant.code = :code', { code })
      .getOne();

    if (!tenant) return null;

    const channelRepo = this.connection.getRepository(ctx, Channel);
    const channels = await channelRepo.find({
      where: { customFields: { tenant: { id: tenant.id } } } as any,
    });

    (tenant as any).channels = channels;
    return tenant;
  }

  async findOneByName(ctx: RequestContext, name: string): Promise<Tenant | null> {
    const tenant = await this.connection
      .getRepository(ctx, Tenant)
      .createQueryBuilder('tenant')
      .where('tenant.name = :name', { name })
      .getOne();

    if (!tenant) return null;

    const channelRepo = this.connection.getRepository(ctx, Channel);
    const channels = await channelRepo.find({
      where: { customFields: { tenant: { id: tenant.id } } } as any,
    });

    (tenant as any).channels = channels;
    return tenant;
  }

  async findAll(ctx: RequestContext): Promise<Tenant[]> {
    const tenants = await this.connection
      .getRepository(ctx, Tenant)
      .createQueryBuilder('tenant')
      .getMany();

    const channelRepo = this.connection.getRepository(ctx, Channel);

    for (const tenant of tenants) {
      const channels = await channelRepo.find({
        where: { customFields: { tenant: { id: tenant.id } } } as any,
      });
      (tenant as any).channels = channels;
    }

    return tenants;
  }

  private async renameTenant(tenant: Tenant, newName: string): Promise<void> {
    tenant.name = newName;
  }

  private async modifyTenantToken(tenant: Tenant, newName: string): Promise<void> {
    tenant.name = newName;
  }

  private async addChannelsToTenant(
    ctx: RequestContext,
    tenant: Tenant,
    channelIds: ID[],
  ): Promise<void> {
    const channelRepo = this.connection.getRepository(ctx, Channel);

    const channels = await channelRepo.findBy({ id: In(channelIds as any[]) });

    for (const channel of channels) {
      if ((channel as any).customFields.tenant && (channel as any).customFields.tenant.id !== tenant.id) {
        throw new Error(`Channel ${channel.code} already assigned to another tenant`);
      }
      (channel as any).customFields.tenant = tenant;
    }

    await channelRepo.save(channels);
  }

  private async removeChannelsFromTenant(
    ctx: RequestContext,
    tenant: Tenant,
    channelIds: ID[],
  ): Promise<void> {
    const channelRepo = this.connection.getRepository(ctx, Channel);

    const channels = await channelRepo.findBy({ id: In(channelIds as any[]) });

    for (const channel of channels) {
      if ((channel as any).customFields.tenant?.id === tenant.id) {
        (channel as any).customFields.tenant = null;
      }
    }

    await channelRepo.save(channels);
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

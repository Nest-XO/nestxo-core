import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ID as GQLID } from '@nestjs/graphql';
import { ID, Ctx, RequestContext, Permission } from '@vendure/core';
import { Allow } from '@vendure/core/dist/api/decorators/allow.decorator';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private tenantService: TenantService) {}

  @Mutation(() => Tenant)
  @Allow(Permission.SuperAdmin)
  async createTenant(
    @Ctx() ctx: RequestContext,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
    @Args('token') token: string,
    @Args('channelIds', { type: () => [GQLID], nullable: true }) channelIds?: ID[],
  ): Promise<Tenant> {
    return this.tenantService.create(ctx, { name, description, token, channelIds });
  }

  @Mutation(() => Tenant)
  @Allow(Permission.SuperAdmin)
  async updateTenant(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => GQLID }) id: ID,
    @Args('name', { nullable: true }) name?: string,
    @Args('addChannelIds', { type: () => [GQLID], nullable: true }) addChannelIds?: ID[],
    @Args('removeChannelIds', { type: () => [GQLID], nullable: true }) removeChannelIds?: ID[],
  ): Promise<Tenant> {
    return this.tenantService.update(ctx, id, { name, addChannelIds, removeChannelIds });
  }

  @Mutation(() => Boolean)
  @Allow(Permission.SuperAdmin)
  async deleteTenant(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => GQLID }) id: ID,
  ): Promise<boolean> {
    return this.tenantService.delete(ctx, id);
  }

  // FIND BY ID
  @Query(() => Tenant, { nullable: true })
  @Allow(Permission.SuperAdmin)
  async tenant(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => GQLID }) id: ID,
  ): Promise<Tenant | null> {
    return this.tenantService.findOneById(ctx, id);
  }

  // FIND BY CODE
  @Query(() => Tenant, { nullable: true })
  @Allow(Permission.SuperAdmin)
  async tenantByCode(
    @Ctx() ctx: RequestContext,
    @Args('code') code: string,
  ): Promise<Tenant | null> {
    return this.tenantService.findOneByCode(ctx, code);
  }

  // FIND BY NAME
  @Query(() => Tenant, { nullable: true })
  @Allow(Permission.SuperAdmin)
  async tenantByName(
    @Ctx() ctx: RequestContext,
    @Args('name') name: string,
  ): Promise<Tenant | null> {
    return this.tenantService.findOneByName(ctx, name);
  }

  // FIND ALL
  @Query(() => [Tenant])
  @Allow(Permission.SuperAdmin)
  async tenants(@Ctx() ctx: RequestContext): Promise<Tenant[]> {
    return this.tenantService.findAll(ctx);
  }
}

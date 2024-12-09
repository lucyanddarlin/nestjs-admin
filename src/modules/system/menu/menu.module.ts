import { forwardRef, Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from './menu.entity'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity]),
    forwardRef(() => RoleModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [TypeOrmModule, MenuService],
})
export class MenuModule {}

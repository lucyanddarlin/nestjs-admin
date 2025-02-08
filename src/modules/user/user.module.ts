import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MenuModule } from '../system/menu/menu.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MenuModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

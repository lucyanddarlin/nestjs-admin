import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VirtualColumn } from 'typeorm'
import { NullableColumn } from '../decorators/nullable-column.decorator'

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export abstract class CompleteEntity extends CommonEntity {
  @ApiHideProperty()
  @Exclude()
  @NullableColumn({ name: 'created_by', update: false, comment: '创建者' })
  createdBy: number

  @ApiHideProperty()
  @Exclude()
  @NullableColumn({ name: 'updated_by', comment: '更新者' })
  updatedBy: number

  @ApiProperty({ description: '创建者' })
  @VirtualColumn({ query: alias => `SELECT username FROM sys_user WHERE id = ${alias}.created_by` })
  creator: string

  @ApiProperty({ description: '更新者' })
  @VirtualColumn({ query: alias => `SELECT username FROM sys_user WHERE id = ${alias}.updated_by` })
  updater: string
}

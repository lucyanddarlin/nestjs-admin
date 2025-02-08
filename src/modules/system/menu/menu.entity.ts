import { NullableColumn } from '@/common/decorators/nullable-column.decorator'
import { CompleteEntity } from '@/common/entity/common.entity'
import { Column, Entity, ManyToMany, Relation } from 'typeorm'
import { RoleEntity } from '../role/role.entity'

@Entity('sys_menu')
export class MenuEntity extends CompleteEntity {
  @NullableColumn({ name: 'parent_id' })
  parentId: number

  @Column()
  name: string

  @NullableColumn()
  path: string

  @NullableColumn()
  permission: string

  @Column({ type: 'tinyint', default: 0 })
  type: number

  @NullableColumn({ default: '' })
  icon: string

  @NullableColumn({ name: 'order_no', default: 0 })
  orderNo: number

  @NullableColumn({ name: 'component' })
  component: string

  @Column({ name: 'is_ext', type: 'tinyint', default: 0 })
  isExt: number

  @Column({ name: 'ext_open_mode', type: 'tinyint', default: 1 })
  extOpenMode: number

  @Column({ name: 'keep_alive', type: 'tinyint', default: 1 })
  keepAlive: number

  @Column({ type: 'tinyint', default: 1 })
  show: number

  @NullableColumn({ name: 'active_menu' })
  activeMenu: string

  @Column({ type: 'tinyint', default: 1 })
  status: number

  @ManyToMany(() => RoleEntity, role => role.menus, {
    onDelete: 'CASCADE',
  })
  roles: Relation<RoleEntity[]>
}

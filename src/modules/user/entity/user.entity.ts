import { NullableColumn } from '@/common/decorators/nullable-column.decorator'
import { CommonEntity } from '@/common/entity/common.entity'
import { AccessTokenEntity } from '@/modules/auth/entity/access-token.entity'
import { Exclude } from 'class-transformer'
import { Column, Entity, OneToMany, Relation } from 'typeorm'

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  username: string

  @Exclude()
  @Column()
  password: string

  @Column({ length: 32 })
  paslt: string

  @NullableColumn()
  nickname: string

  @NullableColumn({ name: 'avatar' })
  avatar: string

  @NullableColumn()
  qq: string

  @NullableColumn()
  email: string

  @NullableColumn()
  phone: string

  @NullableColumn()
  remark: string

  @NullableColumn({ type: 'tinyint', default: 1 })
  status: number

  @OneToMany(
    () => AccessTokenEntity,
    accessToken => accessToken.user,
    {
      cascade: true,
    },
  )
  accessToken: Relation<AccessTokenEntity[]>
}

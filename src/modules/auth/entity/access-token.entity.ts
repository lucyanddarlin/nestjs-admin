import { UserEntity } from '@/modules/user/entity/user.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RefreshTokenEntity } from './refresh-token.entity'

@Entity('user_access_token')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 500 })
  value: string

  @CreateDateColumn({ comment: '令牌创建时间' })
  created_at: Date

  @CreateDateColumn({ comment: '令牌过期时间' })
  expired_at: Date

  @OneToOne(
    () => RefreshTokenEntity,
    refreshToken => refreshToken.accessToken,
    {
      cascade: true,
    },
  )
  refreshToken: RefreshTokenEntity

  @ManyToOne(
    () => UserEntity,
    user => user.accessToken,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}

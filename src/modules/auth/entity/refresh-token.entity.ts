import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AccessTokenEntity } from './access-token.entity'

@Entity('user_refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 500 })
  value: string

  @CreateDateColumn({ comment: '创建时间' })
  created_at: Date

  @CreateDateColumn({ comment: '过期时间' })
  expired_at: Date

  @OneToOne(
    () => AccessTokenEntity,
    accessToken => accessToken.refreshToken,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  accessToken: AccessTokenEntity
}

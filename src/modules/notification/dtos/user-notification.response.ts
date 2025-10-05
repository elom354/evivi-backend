import { ApiProperty } from '@nestjs/swagger';

import { UserNotification } from '@app/notification/infrastructure/models/userNotification';
import { ApiStatus } from '../../core/http';

export class UserNotificationResponse {
  @ApiProperty({ example: ApiStatus.SUCCESS })
  readonly status: string;

  @ApiProperty({ type: UserNotification })
  readonly data: UserNotification;
}

export class ListUserNotificationsResponse {
  @ApiProperty({ example: ApiStatus.SUCCESS })
  readonly status: string;

  @ApiProperty({ type: [UserNotification] })
  readonly data: UserNotification[];
}

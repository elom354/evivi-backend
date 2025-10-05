import { ApiProperty } from '@nestjs/swagger';

import { EmailTemplate } from '@app/notification/infrastructure/models/emailTemplate';
import { ApiStatus } from '../../core/http';

export class EmailTemplateResponse {
  @ApiProperty({ example: ApiStatus.SUCCESS })
  readonly status: string;

  @ApiProperty({ type: EmailTemplate })
  readonly data: EmailTemplate;
}

export class ListEmailTemplatesResponse {
  @ApiProperty({ example: ApiStatus.SUCCESS })
  readonly status: string;

  @ApiProperty({ type: [EmailTemplate] })
  readonly data: EmailTemplate[];
}

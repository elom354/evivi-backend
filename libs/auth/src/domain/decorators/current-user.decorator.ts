import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LeanedDocument } from '@app/core/providers/base.mongo.repository';
import { User } from '@app/user/infrastructure/models';

export const CurrentUser = createParamDecorator(
  (data: keyof LeanedDocument<User> | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as LeanedDocument<User>;

    return data ? user?.[data] : user;
  },
);

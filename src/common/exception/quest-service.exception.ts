import { BaseException } from './base.exception';
import { INVALID_QUEST_ID } from './error-code/error.code';

export function InvalidQuestId(message?: string): BaseException {
  return new BaseException(INVALID_QUEST_ID, message);
}

import { AbilityBuilder, createMongoAbility, MongoAbility, InferSubjects } from '@casl/ability';
import { SharedUser, SharedBook } from '../../../shared/types/index';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = InferSubjects<SharedBook | SharedUser> | 'Book' | 'User' | 'OwnerRevenue' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: SharedUser | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!user) {
    cannot('manage', 'all');
    return build();
  }

  if (user.role === 'ADMIN') {
    can('manage', 'all');
  } else if (user.role === 'OWNER') {
    can('read', 'Book');
    can('create', 'Book');
    can(['update', 'delete'], 'Book', { ownerId: user.id });
    can('read', 'OwnerRevenue');
    can('update', 'User', { id: user.id });
  }

  return build();
}
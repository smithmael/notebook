import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  InferSubjects,
} from '@casl/ability';
import type { User as PrismaUser, Book as PrismaBook } from '@prisma/client';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

// This union allows CASL to validate properties like 'ownerId' against the Prisma types
type Subjects = InferSubjects<PrismaBook | PrismaUser> | 'Book' | 'User' | 'OwnerRevenue' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

function Ability(user: PrismaUser | null): AppAbility {
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
    can('read', 'OwnerRevenue');

    // These will now work because 'Book' is associated with PrismaBook's properties
    can(['update', 'delete'], 'Book', { ownerId: user.id });
    can('update', 'User', { id: user.id });
  }

  return build();
}

export default Ability;
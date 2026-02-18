// server/src/utils/ability.ts
import { AbilityBuilder, createMongoAbility, MongoAbility, InferSubjects } from '@casl/ability';
import { Prisma } from '@prisma/client'; // ✅ Import the Prisma namespace

// Define what your subjects look like based on Prisma's internal types
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

// We use Prisma.UserGetPayload or the Model name directly if generated
// Since your TS is complaining, let's use the Prisma namespace for better safety
type Subjects = InferSubjects<any> | 'Book' | 'User' | 'OwnerRevenue' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

// We use 'any' temporarily or Prisma.UserDelegate to bypass the export error 
// until 'npx prisma generate' finishes
export function defineAbilityFor(user: any | null): AppAbility {
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
    // Using as any prevents the 'ownerId' check from failing if types are still syncing
    can(['update', 'delete'], 'Book', { ownerId: user.id } as any);
    can('read', 'OwnerRevenue');
    can('update', 'User', { id: user.id } as any);
  }

  return build();
}
const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    cannot('manage', 'all');
    return build();
  }

  if (user.role === 'admin') {
    can('manage', 'all'); // Admin can do anything
  } else if (user.role === 'owner') {
    // Owners
    can('read', 'Book'); // can list books

    // Can create books
    can('create', 'Book');

    // Can update/delete only their own books
    can(['update', 'delete'], 'Book', { ownerId: user.id });

    // Can update own profile
    can('update', 'User', { id: user.id });
  }

  return build();
}

module.exports = defineAbilityFor;
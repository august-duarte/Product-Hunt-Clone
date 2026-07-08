import sql from '@/lib/db';
import { nameToUsername } from '@/lib/utils/slug';
import type { PublicUser, PublicUserProfile, User } from '@/types/user';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user as User | undefined;
};

export const findUserByEmailExcludingId = async (
  email: string,
  id: number
): Promise<User[]> => {
  const users = await sql`
    SELECT * FROM users WHERE email = ${email} AND id != ${id}
  `;
  return users as User[];
};

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<PublicUser> => {
  const [user] = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email, avatar_url, created_at
  `;
  return user as PublicUser;
};

export const findPublicUserById = async (id: number): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ${id}
  `;
  return user as PublicUser | undefined;
};

export const findPublicUserProfileById = async (
  id: number,
): Promise<PublicUserProfile | undefined> => {
  const [user] = await sql`
    SELECT
      u.id,
      u.name,
      u.avatar_url,
      u.created_at,
      COALESCE(COUNT(p.id), 0)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    WHERE u.id = ${id}
    GROUP BY u.id, u.name, u.avatar_url, u.created_at
  `;

  if (!user) return undefined;

  const profile = user as Omit<PublicUserProfile, 'username'>;
  return { ...profile, username: nameToUsername(profile.name) };
};

export const findPublicUserProfileByUsername = async (
  username: string,
): Promise<PublicUserProfile | undefined> => {
  const [user] = await sql`
    SELECT
      u.id,
      u.name,
      u.avatar_url,
      u.created_at,
      COALESCE(COUNT(p.id), 0)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    WHERE regexp_replace(
      regexp_replace(lower(trim(u.name)), '[^a-z0-9]+', '-', 'g'),
      '(^-+|-+$)',
      '',
      'g'
    ) = ${username}
    GROUP BY u.id, u.name, u.avatar_url, u.created_at
  `;

  if (!user) return undefined;

  const profile = user as Omit<PublicUserProfile, 'username'>;
  return { ...profile, username: nameToUsername(profile.name) };
};

export const findUserById = async (id: number): Promise<User | undefined> => {
  const [user] = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return user as User | undefined;
};

export const findUserIsAdmin = async (
  id: number
): Promise<Pick<User, 'is_admin'> | undefined> => {
  const [user] = await sql`
    SELECT is_admin FROM users WHERE id = ${id}
  `;
  return user as Pick<User, 'is_admin'> | undefined;
};

export const updateUserNameAndEmail = async (
  id: number,
  name: string,
  email: string
): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    UPDATE users SET name = ${name}, email = ${email}
    WHERE id = ${id}
    RETURNING id, name, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserName = async (
  id: number,
  name: string
): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    UPDATE users SET name = ${name}
    WHERE id = ${id}
    RETURNING id, name, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserEmail = async (
  id: number,
  email: string
): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    UPDATE users SET email = ${email}
    WHERE id = ${id}
    RETURNING id, name, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserPassword = async (id: number, password: string): Promise<void> => {
  await sql`
    UPDATE users SET password = ${password}
    WHERE id = ${id}
  `;
};

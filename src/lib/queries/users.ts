import sql from '@/lib/db';
import type { PublicUser, PublicUserProfile, User } from '@/types/user';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user as User | undefined;
};

export const findUserByUsername = async (
  username: string,
): Promise<User | undefined> => {
  const [user] = await sql`
    SELECT * FROM users WHERE username = ${username}
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

export const findUserByUsernameExcludingId = async (
  username: string,
  id: number,
): Promise<User[]> => {
  const users = await sql`
    SELECT * FROM users WHERE username = ${username} AND id != ${id}
  `;
  return users as User[];
};

export const createUser = async (
  name: string,
  username: string,
  email: string,
  password: string
): Promise<PublicUser> => {
  const [user] = await sql`
    INSERT INTO users (name, username, email, password)
    VALUES (${name}, ${username}, ${email}, ${password})
    RETURNING id, name, username, email, avatar_url, created_at
  `;
  return user as PublicUser;
};

export const findPublicUserById = async (id: number): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    SELECT id, name, username, email, avatar_url, created_at FROM users WHERE id = ${id}
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
      u.username,
      u.avatar_url,
      u.created_at,
      COALESCE(COUNT(p.id), 0)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    WHERE u.id = ${id}
    GROUP BY u.id, u.name, u.username, u.avatar_url, u.created_at
  `;
  return user as PublicUserProfile | undefined;
};

export const findPublicUserProfileByUsername = async (
  username: string,
): Promise<PublicUserProfile | undefined> => {
  const [user] = await sql`
    SELECT
      u.id,
      u.name,
      u.username,
      u.avatar_url,
      u.created_at,
      COALESCE(COUNT(p.id), 0)::int AS product_count
    FROM users u
    LEFT JOIN products p ON p.user_id = u.id
    WHERE u.username = ${username}
    GROUP BY u.id, u.name, u.username, u.avatar_url, u.created_at
  `;
  return user as PublicUserProfile | undefined;
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
    RETURNING id, name, username, email, avatar_url, created_at
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
    RETURNING id, name, username, email, avatar_url, created_at
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
    RETURNING id, name, username, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserUsername = async (
  id: number,
  username: string,
): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    UPDATE users SET username = ${username}
    WHERE id = ${id}
    RETURNING id, name, username, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserProfile = async (
  id: number,
  updates: {
    name: string;
    username: string;
    email: string;
    avatar_url: string | null;
  },
): Promise<PublicUser | undefined> => {
  const [user] = await sql`
    UPDATE users
    SET
      name = ${updates.name},
      username = ${updates.username},
      email = ${updates.email},
      avatar_url = ${updates.avatar_url}
    WHERE id = ${id}
    RETURNING id, name, username, email, avatar_url, created_at
  `;
  return user as PublicUser | undefined;
};

export const updateUserPassword = async (id: number, password: string): Promise<void> => {
  await sql`
    UPDATE users SET password = ${password}
    WHERE id = ${id}
  `;
};

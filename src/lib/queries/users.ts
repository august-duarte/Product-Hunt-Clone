import sql from '@/lib/db';

export const findUserByEmail = async (email: string) => {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return user;
};

export const findUserByEmailExcludingId = async (email: string, id: number) => {
  const users = await sql`
    SELECT * FROM users WHERE email = ${email} AND id != ${id}
  `;
  return users;
};

export const createUser = async (name: string, email: string, password: string) => {
  const [user] = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email, created_at
  `;
  return user;
};

export const findPublicUserById = async (id: number) => {
  const [user] = await sql`
    SELECT id, name, email, created_at FROM users WHERE id = ${id}
  `;
  return user;
};

export const findUserById = async (id: number) => {
  const [user] = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return user;
};

export const findUserIsAdmin = async (id: number) => {
  const [user] = await sql`
    SELECT is_admin FROM users WHERE id = ${id}
  `;
  return user;
};

export const updateUserNameAndEmail = async (id: number, name: string, email: string) => {
  const [user] = await sql`
    UPDATE users SET name = ${name}, email = ${email}
    WHERE id = ${id}
    RETURNING id, name, email, created_at
  `;
  return user;
};

export const updateUserName = async (id: number, name: string) => {
  const [user] = await sql`
    UPDATE users SET name = ${name}
    WHERE id = ${id}
    RETURNING id, name, email, created_at
  `;
  return user;
};

export const updateUserEmail = async (id: number, email: string) => {
  const [user] = await sql`
    UPDATE users SET email = ${email}
    WHERE id = ${id}
    RETURNING id, name, email, created_at
  `;
  return user;
};

export const updateUserPassword = async (id: number, password: string) => {
  await sql`
    UPDATE users SET password = ${password}
    WHERE id = ${id}
  `;
};

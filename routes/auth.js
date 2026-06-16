require('dotenv').config();
const router = require('express').Router()
const sql = require('../db');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation, updateProfileValidation } = require('../validation');
const verifyToken = require('../src/lib/auth/verify-token');
const { createToken } = require('../lib/auth/jwt');

//router para buscar user pelo id
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    //req.params puxa o que estiver no lugar de :userid na URL
    const { userId } = req.params;
    if (req.user.id !== Number(userId)) {
      const [currentUser] = await sql`
        SELECT is_admin FROM users WHERE id = ${req.user.id}
      `;
      if (!currentUser?.is_admin) {
        return res.status(403).json({ message: 'Not allowed' });
      }
    }
    const [user] = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${userId}
    `
    //se user não existir
    if (!user) return res.status(404).json({ message: 'User not found' });
    //se user existir e verificação ok, manda o user
    res.json(user);
  } catch (error) {
    console.error('Get user failed', error);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});

//router para mudar informações do user
router.patch('/me', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.user

    //verifica se as informações são válidas
    const { error } = updateProfileValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    //verifica se o email já existe
    if (email) {
      const emailExists = await sql`
        SELECT * FROM users WHERE email = ${email} AND id != ${id}
      `;
      if (emailExists.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    let user;

    //se body tiver email e nome
    if (name && email) {
      [user] = await sql`
        UPDATE users SET name = ${name}, email = ${email}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;

      //se body só tiver nome
    } else if (name) {
      [user] = await sql`
        UPDATE users SET name = ${name}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;

      //se body só tiver email
    } else if (email) {
      [user] = await sql`
        UPDATE users SET email = ${email}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Information update failed', error);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});

//router para logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    await sql`
      INSERT INTO blacklisted_jwts (jwt) VALUES (${token})
    `;
    req.headers.authorization = null;
    res.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout failed', error);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});

//router para mudar senha
router.patch('/me/password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    if (!user) return res.status(404).json({ message: 'User not found' });
    const validOldPassword = await bcrypt.compare(oldPassword, user.password)
    if (!validOldPassword) {
      return res.status(400).json({ message: 'Invalid old password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE users SET password = ${hashedNewPassword}
      WHERE id = ${req.user.id}
    `;
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update failed', error);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
});
module.exports = router;

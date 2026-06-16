import sql from "@/lib/db";
import { loginValidation } from "@/lib/validation";
import bcrypt from "bcrypt";
import { createToken } from "@/lib/auth/jwt";

export const POST = async (req: Request, res: Response) => {
  try {
    //valida as info
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    //mesma coisa em /register, menos nome
    const { email, password } = req.body;

    //verifica se user existe
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    //se deu errado, manda a mensagem de erro
    if (!user) {
      return res.status(400).json({ message: 'User doesn\'t exist. Please check your email and password.' })
    }
    //compara a senha enviada com a senha na db
    const validPassword = await bcrypt.compare(password, user.password);

    //senha errada
    if (validPassword === false) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    //cria o token
    const token = createToken(user.id);

    //se tudo deu certo, login ok
    res.json({ token: token });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
})

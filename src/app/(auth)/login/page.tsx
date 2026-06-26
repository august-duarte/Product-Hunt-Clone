import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Sign up on Product Hunt</h1>
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <Button>Login</Button>
    </div>
  );
}

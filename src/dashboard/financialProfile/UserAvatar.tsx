import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImage from "../../assets/placeholder-user.jpg";

export default function UserAvatar() {
  return (
    <Avatar className="grayscale" size="lg">
      <AvatarImage src={avatarImage} alt="Imagem do usuário" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}

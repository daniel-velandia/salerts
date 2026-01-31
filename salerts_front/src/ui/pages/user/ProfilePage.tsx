import { useUserConfig } from "@/hooks/user/useUserConfig";
import { ProfileForm } from "@/ui/components/user/ProfileForm";
import { PasswordForm } from "@/ui/components/user/PasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/shadcn/tabs";
import { User, ShieldCheck } from "lucide-react";

export const ProfilePage = () => {
  const { profile, updateProfile, updatePassword, loading } = useUserConfig();

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">Configuración de Usuario</h2>
        <p className="text-sm md:text-base text-gray-600">
          Gestiona tu información personal y seguridad de la cuenta.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Seguridad</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm 
            profile={profile} 
            onSubmit={updateProfile} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="security">
          <PasswordForm 
            onSubmit={updatePassword} 
            loading={loading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

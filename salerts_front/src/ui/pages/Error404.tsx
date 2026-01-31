import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/shadcn";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
          404 - Página no encontrada
        </h1>
        <p className="text-lg text-muted-foreground max-w-150">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Es
          posible que haya sido movida o eliminada.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </Button>

        <Button onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" />
          Ir al Inicio
        </Button>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
    </div>
  );
};

export default Error404;

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    const createToken = async () => {
        try {
            const viewerToken = await createViewerToken(hostIdentity);
            setToken(viewerToken);

            const decodedToken = jwtDecode(viewerToken) as JwtPayload & {name?: string};
            const name = decodedToken?.name;
            const identity = decodedToken.sub;

            console.log({name, identity});

            if(identity){
              setIdentity(identity);
            }

            if(name){
              setName(name);
            }
        } catch {
            toast.error("Failed to create viewer token");
        }
    }

    createToken();
  }, [hostIdentity]);

  return { token, name, identity };
};

import { useAuth, useUser } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUsers } from "../lib/api";

function useUserSync() {
    const {isSignedIn} = useAuth();
    const {user} = useUser();

    const {mutate:syncUserMutation, isPending, isSuccess } = useMutation({mutationFn:syncUsers});

    useEffect(() => {
        if (isSignedIn && !isPending && !isSuccess && user){
            syncUserMutation({
                email: user.primaryEmailAddress.emailAddress,
                name: user.fullName || user.firstName,
                imageUrl: user.imageUrl,
            });
        }
    }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

    return{isSignedIn: isSuccess};
}

export default useUserSync
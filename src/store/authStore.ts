import { create } from "zustand";

interface User {
    id: number;
    username: string;
    email:string;
}

interface AuthState {
    user: User | null;
    login: (userData: User) => void;
    logout: ()=>void;
}

const useAuthStore = create<AuthState>((set)=>({
    user:null,
    login: (userData) => set({user:userData}),
    logout:()=>set({user:null}),
}))

export default useAuthStore;
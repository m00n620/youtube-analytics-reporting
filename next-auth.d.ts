import "next-auth"
import "next-auth/jwt"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires: number
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

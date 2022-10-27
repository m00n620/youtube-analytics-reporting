import "next-auth/jwt"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

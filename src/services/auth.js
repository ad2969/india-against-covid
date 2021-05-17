import { auth } from './firebase'

export const loginAsAdmin = async (email, password) => {
    try {
        const userCredentials = await auth.signInWithEmailAndPassword(email, password)
        const user = userCredentials.user
        return user
    }
    catch(err) {
        throw new Error(`FIREBASE ${err.code} ERROR: ${err.message}`)
    }
}

export const logout = async () => {
    try {
        await auth.signOut()
    }
    catch(err) {
        throw new Error(`FIREBASE ${err.code} ERROR: ${err.message}`)
    }
}

export const isAuthenticated = () => {
    const currentUser = auth.currentUser
    return !!currentUser
}
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);

    // 1 user signed out <SignInButton />
    // 2 user signed in, but missing username <UsernameForm/>
    // 3 user signed in, has username <SignOutButton />

    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
            .then((user) => {
                console.log(user);
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    ); 
}

function SignOutButton() {
    return <button onClick={() => 
        signOut(auth)
            .then((user) => {
            console.log(user);
            })
            .catch((error) => {
                console.error(error);
            })
        }
    >Sign Out</button>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue])

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(firestore, "users", user.uid);
        const usernameDoc = doc(firestore, "usernames", formValue);

        // Commit both docs together as a batch write
        // https://firebase.google.com/docs/firestore/manage-data/transactions
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
        try {
            console.log("Writing user to database!")
            await batch.commit();
        } catch (e) {
            console.log(e);
        }
    };

    // Hit the database for username match after each devounce change
    // useCallback is required for debounce to work
    const checkUsername = useCallback( 
        // https://firebase.google.com/docs/firestore/query-data/get-data
        debounce(async (username) => {
            if (username.length >= 3) {
                const docRef = doc(firestore, "usernames", username);
                const querySnapshot = await getDoc(docRef);
                console.log('Firestore read executed!')
                setIsValid(!querySnapshot.exists());
                setLoading(false);
            }
        }, 500),
        []
    )

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return  <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p> 
    } else {
        return <p></p>
    }
}
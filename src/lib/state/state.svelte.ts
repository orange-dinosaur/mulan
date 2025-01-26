import type { UserBooks } from '$lib/types/book';

type UserState = {
	user: string | undefined;
	userBooks: UserBooks | undefined;
	searchString: string;
};

export function createUserState(user?: string, userBooks?: UserBooks, searchString?: string) {
	const userState: UserState = $state({
		user: user || undefined,
		userBooks: userBooks || undefined,
		searchString: searchString || ''
	});

	return {
		get user() {
			return userState.user;
		},
		get userBooks() {
			return userState.userBooks;
		},
		get searchString() {
			return userState.searchString;
		},

		set user(user: string | undefined) {
			userState.user = user;
		},
		set userBooks(userBooks: UserBooks | undefined) {
			userState.userBooks = userBooks;
		},
		set searchString(searchString: string) {
			userState.searchString = searchString;
		},

		checkIfUserIsDefined() {
			return userState.user !== undefined;
		},
		checkIfUserBooksAreDefined() {
			return userState.userBooks !== undefined;
		}
	};
}

export const userState = createUserState();

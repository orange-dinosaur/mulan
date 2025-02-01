import { BookFull, UserBooks } from '$lib/types/book';

export class UserState {
	#userState: {
		user: string;
		userBooks: UserBooks;
		searchString: string;
	};

	constructor(user?: string, userBooks?: UserBooks, searchString?: string) {
		this.#userState = {
			user: user || '',
			userBooks: userBooks || new UserBooks(''),
			searchString: searchString || ''
		};
	}

	get user() {
		return this.#userState.user;
	}
	get userBooks() {
		return this.#userState.userBooks;
	}
	get searchString() {
		return this.#userState.searchString;
	}

	set user(user: string) {
		this.#userState.user = user;
	}
	set userBooks(userBooks: UserBooks) {
		this.#userState.userBooks = userBooks;
	}
	set userBooksUserId(user: string) {
		this.#userState.userBooks.userId = user;
	}
	set userBooksBooks(books: BookFull[]) {
		this.#userState.userBooks.books = books;
	}
	set searchString(searchString: string) {
		this.#userState.searchString = searchString;
	}
}

export const userState = $state(new UserState());

/* type UserState = {
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
 */

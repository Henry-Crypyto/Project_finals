// export const API_URL = 'http://localhost:3000';
export const API_URL = 'https://terrier-apt-honestly.ngrok-free.app/api';

export function getFullApiUrl(path) {
    return `${API_URL}${path}`;
}



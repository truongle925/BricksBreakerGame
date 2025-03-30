import AsyncStorage from '@react-native-async-storage/async-storage';


// Hàm lưu điểm mới vào danh sách
export const saveHighScore = async (newScore,keyItem) => {
    try {
        // Lấy danh sách điểm cao từ AsyncStorage
        const storedScores = await AsyncStorage.getItem(keyItem);
        let highScores = storedScores ? JSON.parse(storedScores) : [];

        // Thêm điểm mới vào danh sách
        highScores.push(newScore);

        // Sắp xếp danh sách theo điểm từ cao đến thấp
        highScores.sort((a, b) => b - a);

        // Giữ lại tối đa 10 điểm cao nhất
        highScores = highScores.slice(0, 10);

        // Lưu lại vào AsyncStorage
        await AsyncStorage.setItem(keyItem, JSON.stringify(highScores));
    } catch (error) {
        console.error('Lỗi khi lưu điểm cao:', error);
    }
};

export const getHighScores = async (keyItem) => {
    try {
        const storedScores = await AsyncStorage.getItem(keyItem);
        return storedScores ? JSON.parse(storedScores) : [];
    } catch (error) {
        console.error('Lỗi khi lấy điểm cao:', error);
        return [];
    }
};

export const clearHighScores = async (keyItem) => {
    try {
        await AsyncStorage.removeItem(keyItem);
    } catch (error) {
        console.error('Lỗi khi xóa điểm cao:', error);
    }
};


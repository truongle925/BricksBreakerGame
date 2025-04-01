import { Audio } from 'expo-av';

/**
 * Hàm tạo âm thanh
 * @param soundFile
 */
export const playSound = async (soundFile) => {
    try {
        // Tạo và phát âm thanh
        const { sound } = await Audio.Sound.createAsync(soundFile);
        await sound.playAsync();

        // Giải phóng bộ nhớ khi phát xong
        sound.setOnPlaybackStatusUpdate((status) => {

            if (status.didJustFinish) {
                sound.unloadAsync();
            }

        });
    } catch (error) {
        console.log('Lỗi khi phát âm thanh:', error);
    }
};

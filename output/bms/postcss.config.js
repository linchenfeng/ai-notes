/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 13:52:46
 * @LastEditors  : may.ruan
 * @LastEditTime : 2022-12-16 16:58:00
 * @Description  : postcss autoprefixer
 */
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31']
    }
  }
}

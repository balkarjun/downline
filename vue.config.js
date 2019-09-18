module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.jarbun.downline',
        extraFiles: [
          {
            from: './dev/resources',
            to: './resources',
            filter: '**/*'
          }
        ]
      }
    }
  }
};

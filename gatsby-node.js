exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /gantt-schedule-timeline-calendar/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

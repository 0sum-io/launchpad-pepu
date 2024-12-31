const target = process.env.TARGET;
const stage = process.env.STAGE;

const config = {
  live: {
    name: "launchpad-frontent",
    subName: "launchpad-frontent",
    cloudfront: {
      distributionId: "E7CE22VXFRSE3",
      comment: "launchpad-frontent",
    },
  },
}[stage];

module.exports = {
  stage: stage,
  useDotenv: true,
  [config.name]: {
    component: "@sls-next/serverless-component@3.6.0",
    inputs: {
      bucketName: config.subName,
      bucketRegion: "ap-northeast-2",
      build: {
        env: {
          SERVICE_TYPE: target,
          STAGE: stage,
        },
      },
      name: {
        defaultLambda: config.subName,
        imageLambda: `${config.subName}-images`,
      },
      roleArn: "arn:aws:iam::008932047366:role/7adtewa-em3v6gq",
      build: { env: { STAGE: stage } },
      cloudfront: config.cloudfront,
    },
  },
};

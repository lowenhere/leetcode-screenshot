import axios, { AxiosResponse } from "axios";

export interface Challenge {
  date: string;
  link: string;
  question: {
    questionFrontendId: string;
    title: string;
    titleSlug: string;
  };
}

const url = "https://leetcode.com/graphql";
const operationName = "dailyCodingQuestionRecords";
const query = `
query dailyCodingQuestionRecords($year: Int!, $month: Int!) {
    dailyCodingChallengeV2(year: $year, month: $month) {
      challenges {
        date
        link
        question {
          questionFrontendId
          title
          titleSlug
        }
      }
    }
  }`;

const getDailies = async (year: number, month: number): Promise<Challenge[]> => {
  const response = await axios.post(
    url,
    {
      query,
      operationName,
      variables: { year, month },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.dailyCodingChallengeV2.challenges;
};

export default getDailies;

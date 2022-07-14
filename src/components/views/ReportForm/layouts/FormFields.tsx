import { tsx } from "@arcgis/core/widgets/support/widget";
import { MissionReportQuestion } from "../../../../typings/mission";

const inputTypeMap = new Map();
inputTypeMap.set("esriQuestionTypeText", "text");
inputTypeMap.set("esriQuestionTypeTextArea", "textarea");

export const makeFormElement = (question: MissionReportQuestion) => {
  const { type } = question;
  let formItem;
  switch (type) {
    case "esriQuestionTypeText":
    case "esriQuestionTypeTextArea":
      formItem = _makeTextInputField(question);
      break;
    default:
      formItem = null;
  }

  return formItem;
};

function _makeTextInputField(q: MissionReportQuestion) {
  return (
    <div class={"report-question-container leader-1 trailer-1"}>
      <calcite-label for={q.id}>{q.label}</calcite-label>
      <calcite-input
        autofocus={"false"}
        clearable={"true"}
        id={q.id}
        label="Label Text"
        placeholder={"Enter input here"}
        type={inputTypeMap.get(q.type)}
        scale={"l"}
        name={q.fieldName}
      ></calcite-input>
    </div>
  );
}

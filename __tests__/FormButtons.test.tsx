import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import FormButtons from "@/components/FormButtons";

// Mock the useTranslation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("FormButtons Component", () => {
  const mockOnClick = jest.fn();
  const mockActions = { back: jest.fn() };
  const theme = createTheme();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the 'Create' button when isCreateCentered is true and not other conditions", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={true}
          isCreatedFacilitator={false}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={false}
        />
      </ThemeProvider>
    );

    const createButton = screen.getByRole("button", {
      name: "COMMON.CREATE",
    });

    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveTextContent("COMMON.CREATE");
  });

  it("should render the 'Next' button when isCreateCentered is false and isCreatedFacilitator is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={true}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={false}
        />
      </ThemeProvider>
    );

    const nextButton = screen.getByRole("button", { name: "GUIDE_TOUR.NEXT" });

    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent("GUIDE_TOUR.NEXT");
  });

  it("should render the 'Save' button when isSingleButton is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={false}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={true}
        />
      </ThemeProvider>
    );

    const saveButton = screen.getByRole("button", { name: "COMMON.SAVE" });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("COMMON.SAVE");
  });

  it("should call onClick with formData when the primary button is clicked", () => {
    const mockFormData = { name: "Test" };

    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={mockFormData}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={true}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={false}
        />
      </ThemeProvider>
    );

    const primaryButton = screen.getByRole("button", {
      name: "GUIDE_TOUR.NEXT",
    });

    fireEvent.click(primaryButton);

    expect(mockOnClick).toHaveBeenCalledWith(mockFormData);
  });

  it("should call actions.back when the 'Back' button is clicked", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={false}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={false}
        />
      </ThemeProvider>
    );

    const backButton = screen.getByRole("button", { name: "COMMON.BACK" });

    fireEvent.click(backButton);

    expect(mockActions.back).toHaveBeenCalled();
  });

  it("should render only the primary button when isSingleButton is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={false}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={true}
        />
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);

    const primaryButton = screen.getByRole("button", { name: "COMMON.SAVE" });
    expect(primaryButton).toBeInTheDocument();
  });

  it("should render the 'Back' button when isSingleButton is false and isCreateCentered, isCreatedFacilitator, isCreatedLearner are false", () => {
    render(
      <ThemeProvider theme={theme}>
        <FormButtons
          formData={{}}
          onClick={mockOnClick}
          isCreateCentered={false}
          isCreatedFacilitator={false}
          isCreatedLearner={false}
          actions={mockActions}
          isSingleButton={false}
        />
      </ThemeProvider>
    );

    const backButton = screen.getByRole("button", { name: "COMMON.BACK" });
    expect(backButton).toBeInTheDocument();

    const primaryButton = screen.getByRole("button", { name: "GUIDE_TOUR.NEXT" });
    expect(primaryButton).toBeInTheDocument();
  });
});


interface Window {
  GA_INITIALIZED: boolean;
}

declare namespace JSX {
  interface IntrinsicElements {
    "questionnaire-player-main": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      assessment?: string;
      fileuploadresponse?: string;
    };
  }
}

interface Navigator {
  standalone?: boolean;
}


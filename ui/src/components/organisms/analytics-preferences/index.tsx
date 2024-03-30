import clsx from "clsx";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useNotification from "../../../hooks/use-notification";
import { useAnalytics } from "../../../providers/analytics-provider";
import { useAdminCreateAnalyticsConfig } from "../../../services/analytics";
import { getErrorMessage } from "../../../utils/error-messages";
import { nestedForm } from "../../../utils/nested-form";
import Button from "../../fundamentals/button";
import InputField from "../../molecules/input";
import FocusModal from "../../molecules/modal/focus-modal";
import AnalyticsConfigForm, {
	AnalyticsConfigFormType,
} from "../analytics-config-form";

type AnalyticsPreferenceFormType = {
	email?: string;
	config: AnalyticsConfigFormType;
};

const AnalyticsPreferencesModal = () => {
	const { t } = useTranslation();
	const notification = useNotification();
	const { mutate, isLoading } = useAdminCreateAnalyticsConfig();

	const form = useForm<AnalyticsPreferenceFormType>({
		defaultValues: {
			config: {
				anonymize: false,
				opt_out: false,
			},
		},
	});
	const {
		register,
		formState: { errors },
		control,
	} = form;

	const { setSubmittingConfig, trackUserEmail } = useAnalytics();

	const watchOptOut = useWatch({
		control: control,
		name: "config.opt_out",
	});

	const watchAnonymize = useWatch({
		control: control,
		name: "config.anonymize",
	});

	const onSubmit = form.handleSubmit((data) => {
		setSubmittingConfig(true);
		const { email, config } = data;

		const shouldTrackEmail = !config.anonymize && !config.opt_out;

		mutate(config, {
			onSuccess: () => {
				notification(
					t("analytics-preferences-success", "Success"),
					t(
						"analytics-preferences-your-preferences-were-successfully-updated",
						"Your preferences were successfully updated"
					),
					"success"
				);

				if (shouldTrackEmail) {
					trackUserEmail({ email });
				}

				setSubmittingConfig(false);
			},
			onError: (err) => {
				notification(
					t("analytics-preferences-error", "Error"),
					getErrorMessage(err),
					"error"
				);
				setSubmittingConfig(false);
			},
		});
	});

	return (
		<FocusModal>
			<FocusModal.Main>
				<div className="flex flex-col items-center">
					<div className="mt-5xlarge flex w-full max-w-[664px] flex-col">
						<h1 className="inter-xlarge-semibold mb-large">
							additional information
						</h1>
						<div className="mt-xlarge gap-y-xlarge flex flex-col">
							<InputField
								label={""}
								placeholder="First Name"
								disabled={watchOptOut || watchAnonymize}
								className={clsx("transition-opacity", {
									"opacity-50": watchOptOut || watchAnonymize,
								})}
								errors={errors}
							/>
						</div>
						<div className="mt-5xlarge flex items-center justify-end">
							<Button
								variant="primary"
								size="small"
								loading={isLoading}
								onClick={onSubmit}
							>
								{t(
									"analytics-preferences-continue",
									"Continue"
								)}
							</Button>
						</div>
					</div>
				</div>
			</FocusModal.Main>
		</FocusModal>
	);
};

export default AnalyticsPreferencesModal;

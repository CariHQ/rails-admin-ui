import clsx from "clsx";
import { useForm, UseFormSetError, useWatch } from "react-hook-form";
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
import { useState } from "react";
import { MEDUSA_BACKEND_URL } from "../../../constants/medusa-backend-url";
import InputError from "../../atoms/input-error";
import { useNavigate } from "react-router-dom";

type AnalyticsPreferenceFormType = {
	email?: string;
	config: AnalyticsConfigFormType;
};
type AddFormValues = {
	first_name: string;
	last_name: string;
	country: string;
	store_name: string;
};
const useSign = (
	props: AddFormValues,
	setError: UseFormSetError<AddFormValues>,
	setisLoading: Function,
	mutate: Function,
	trackUserEmail: any,
	setSubmittingConfig: any,
	navigate: any
) => {
	const url =
		MEDUSA_BACKEND_URL +
		(MEDUSA_BACKEND_URL === "/" ? "" : "/") +
		"auth/addional";
	console.log(url);

	fetch(url, {
		mode: "cors",
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(props),
		credentials: "include",
	})
		.then((res) => {
			setisLoading(false);
			console.log(props);
			if (res.status !== 200) {
				return setError(
					"country",
					{
						type: "invalid_data",
						message: "some thing got wrong try again later ",
					},
					{
						shouldFocus: true,
					}
				);
			}
			mutate(
				{
					anonymize: false,
					opt_out: false,
				},
				{
					onSuccess: () => {
						setSubmittingConfig(false);
						navigate(0);
					},
				}
			);
			return;
		})
		.catch((err) => {
			setisLoading(false);
			return setError(
				"country",
				{
					type: "invalid_data",
					message: "Internal server Error check again later",
				},
				{
					shouldFocus: true,
				}
			);
		});
};

const AnalyticsPreferencesModal = () => {
	const { t } = useTranslation();
	const notification = useNotification();
	const { mutate } = useAdminCreateAnalyticsConfig();

	const form = useForm<AnalyticsPreferenceFormType>({
		defaultValues: {
			config: {
				anonymize: false,
				opt_out: false,
			},
		},
	});

	const { setSubmittingConfig, trackUserEmail } = useAnalytics();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<AddFormValues>();
	const [isLoading, setisLoading] = useState(false);
	const navigate = useNavigate();

	// const onSubmit = form.handleSubmit((data) => {
	// 	setSubmittingConfig(true);
	// 	const { email, config } = data;
	const email = "taha";
	// 	const shouldTrackEmail = !config.anonymize && !config.opt_out;

	// 	mutate(config, {
	// 		onSuccess: () => {
	// 			notification(
	// 				t("analytics-preferences-success", "Success"),
	// 				t(
	// 					"analytics-preferences-your-preferences-were-successfully-updated",
	// 					"Your preferences were successfully updated"
	// 				),
	// 				"success"
	// 			);

	// 			if (shouldTrackEmail) {

	// 			}

	// 		},
	// 		onError: (err) => {
	// 			notification(
	// 				t("analytics-preferences-error", "Error"),
	// 				getErrorMessage(err),
	// 				"error"
	// 			);
	// 			setSubmittingConfig(false);
	// 		},
	// 	});
	// });

	const onSubmit = async (values: AddFormValues) => {
		setisLoading(true);

		await useSign(
			values,
			setError,
			setisLoading,
			mutate,
			trackUserEmail,
			setSubmittingConfig,
			navigate
		);
	};
	return (
		<FocusModal>
			<FocusModal.Main>
				<div className="flex flex-col items-center">
					<div className="mt-5xlarge flex w-full max-w-[664px] flex-col">
						<h1 className="inter-xlarge-semibold mb-large">
							additional information
						</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="mt-xlarge gap-y-xlarge flex flex-col">
								<InputField
									label={""}
									placeholder="First Name*"
									errors={errors}
									{...register("first_name", {
										required: true,
									})}
								/>
							</div>
							<div className="mt-xlarge gap-y-xlarge flex flex-col">
								<InputField
									label={""}
									placeholder="Last Name*"
									errors={errors}
									{...register("last_name", {
										required: true,
									})}
								/>
							</div>

							<div className="mt-xlarge gap-y-xlarge flex flex-col">
								<InputField
									label={""}
									placeholder="Your Store Name"
									errors={errors}
									{...register("store_name", {
										required: true,
									})}
								></InputField>
							</div>
							<div className="mt-xlarge gap-y-xlarge flex flex-col">
								<select
									className={clsx(
										"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
										{
											"focus-within:shadow-cta focus-within:shadow-rose-60/10 border-rose-50 focus-within:border-rose-50 focus:border-rose-50 focus:ring-rose-50":
												errors && errors.country,
										}
									)}
									{...register("country", {
										validate: (value) => value !== "0",
									})}
								>
									<option value="0" selected>
										Choose a country
									</option>
									<option value="Nigeria">Nigeria</option>
									<option value="Morocco">Morocco</option>
								</select>
								<InputError name={"country"} errors={errors} />
							</div>
							<div className="mt-5xlarge flex items-center justify-end">
								<Button
									variant="primary"
									size="small"
									loading={isLoading}
								>
									{t(
										"analytics-preferences-continue",
										"Continue"
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</FocusModal.Main>
		</FocusModal>
	);
};

export default AnalyticsPreferencesModal;

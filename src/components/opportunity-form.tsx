'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Chip,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { OpportunityFormData } from '@/types/opportunity';
import {
  getSkills,
  getCategories,
  getOrganizations,
  getLocation,
  getLocationCode,
  getBenefits,
} from '@/lib/api';
import { useTranslation } from 'next-i18next';

const formSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    min_experience: z.number().min(0, 'Minimum experience cannot be negative'),
    min_salary: z.number().min(0, 'Minimum salary cannot be negative'),
    max_salary: z.string().min(1, 'Stipend cannot be negative'),
    category: z.string().min(1, 'At least one category is required'),
    company: z.string().min(1, 'Organisation is required'),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    no_of_candidates: z.number().min(1, 'Number of candidates is required'),
    status: z.string().min(1, 'Status is required'),
    // organisation: z.string().min(1, "At least one organisation is required"),
    role_type: z.string().min(1, 'Role type is required'),
    work_nature: z.string().min(1, 'Work nature is required'),
    benefits: z.string().min(1, 'Benefits are required'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    // stipend: z.string().min(1, "Stipend is required"),
    otherBenefits: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.benefits === '51d25808-371b-4ba3-9d85-a16e3a5793be' &&
      !data.otherBenefits
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Other benefits are required when the specific benefit is selected',
        path: ['otherBenefits'],
      });
    }
  });

interface OpportunityFormProps {
  initialData?: Partial<OpportunityFormData>;
  onSubmit: (data: OpportunityFormData) => Promise<void>;
  onCancel?: () => void;
}

interface Item {
  id: string;
  name: string;
}

interface Location {
  country: string;
  state: string;
  city: string;
}

export function OpportunityForm({
  initialData,
  onSubmit,
  onCancel,
}: OpportunityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Location[]>([]);
  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [locationCode, setlocationCode] = useState('');
  const [skills, setSkills] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Item[]>([]);
  const [organisation, setOrganisation] = useState<Item[]>([]);
  const [benefits, setBenefits] = useState<Item[]>([]);
  const { t } = useTranslation();

  const defaultValues: Partial<OpportunityFormData> = {
    title: '',
    description: '',
    min_experience: 0,
    min_salary: 0,
    max_salary: '0',
    category: initialData?.category?.name || '',
    company: '',
    skills: [],
    no_of_candidates: 0,
    status: 'pending',
    role_type: '',
    work_nature: '',
    benefits: '',
    ...initialData,
  };

  console.log(defaultValues, 'defaultValues');

  async function handleFormSubmit(data: OpportunityFormData) {
    const transformedData = {
      ...data,
      location: locationCode, // Ensure mapping happens here
    };

    console.log('Submitting form data:', transformedData);

    try {
      setIsLoading(true);
      await onSubmit(transformedData); // Make sure onSubmit is defined and handles API errors
    } catch (error) {
      console.error('Error submitting opportunity:', error); // 🔍 Log any errors
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          skillsResponse,
          categoriesResponse,
          organisationResponse,
          countriesResponse,
          benefitsResponse,
        ] = await Promise.all([
          getSkills(),
          getCategories(),
          getOrganizations(),
          getLocation(),
          getBenefits(),
        ]);
        setSkills(skillsResponse?.result);
        setCategories(categoriesResponse?.result);
        setOrganisation(organisationResponse?.result);
        setCountries(countriesResponse.result);
        setBenefits(benefitsResponse?.result);
      } catch (e) {
        console.log(e, 'error');
      }
    }
    fetchData();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  console.log(errors, 'errors---');

  const selectedCountry = watch('country');
  const selectedState = watch('state');

  useEffect(() => {
    if (selectedCountry) {
      getLocation({ country: selectedCountry })
        .then((data) => setStates(data.result))
        .catch((err) => console.log(err, 'error fetching states'));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      getLocation({ country: selectedCountry, state: selectedState })
        .then((data) => setCities(data.result))
        .catch((err) => console.log(err, 'error fetching cities'));
    }
  }, [selectedCountry, selectedState]);

  const selectedCity = watch('city');

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      getLocationCode({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      })
        .then((data) => {
          console.log(data.result[0].id, 'location code');

          setlocationCode(data.result[0].id); // Set the location field with result.id
        })
        .catch((err) => console.log(err, 'Error fetching location code'));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ mt: 2 }}
        position={'relative'}
      >
        <Grid container spacing={3} p={'20px'} pt={0}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('OPPORTUNITY.TITLE')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label={t('OPPORTUNITY.DESCRIPTION')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.country}>
                  <InputLabel>{t('OPPORTUNITY.COUNTRY')}</InputLabel>
                  <Select label={t('OPPORTUNITY.COUNTRY')} {...field}>
                    {countries.map((item) => (
                      <MenuItem key={item.country} value={item.country}>
                        {item.country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.state}>
                  <InputLabel>{t('OPPORTUNITY.COUNTY')}</InputLabel>
                  <Select
                    {...field}
                    disabled={!selectedCountry}
                    label={t('OPPORTUNITY.COUNTY')}
                  >
                    {states.map((item) => (
                      <MenuItem key={item.state} value={item.state}>
                        {item.state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.city}>
                  <InputLabel>{t('OPPORTUNITY.SUBCOUNTY')}</InputLabel>
                  <Select
                    {...field}
                    value={defaultValues?.location?.city}
                    disabled={!selectedState}
                    label={t('OPPORTUNITY.SUBCOUNTY')}
                  >
                    {cities.map((item) => (
                      <MenuItem key={item.city} value={item.city}>
                        {item.city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.company}>
                  <InputLabel>{t('OPPORTUNITY.ORGANISATION')}</InputLabel>
                  <Select
                    {...field}
                    value={defaultValues?.company?.id}
                    label="Organisation"
                    onChange={(event) => field.onChange(event.target.value)} // Store a single value
                  >
                    {organisation.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.company && <FormHelperText></FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>{t('OPPORTUNITY.CATEGORY')}</InputLabel>
                  <Select
                    {...field}
                    value={defaultValues?.category?.id}
                    label={t('OPPORTUNITY.CATEGORY')}
                    onChange={(event) => field.onChange(event.target.value)} // Store single value
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText></FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="role_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role_type}>
                  <InputLabel>{t('OPPORTUNITY.ROLETYPE')}</InputLabel>
                  <Select
                    {...field}
                    label={t('OPPORTUNITY.ROLETYPE')}
                    // value={defaultValues?.role_type}
                  >
                    {['Part-time', 'entry'].map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role_type && (
                    <FormHelperText>{errors.role_type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="benefits"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.benefits}>
                  <InputLabel>{t('OPPORTUNITY.BENIFITS')}</InputLabel>
                  <Select
                    {...field}
                    // value={defaultValues?.benefits || ''}
                    onChange={(event) => field.onChange(event.target.value)} // Set single value
                    input={<OutlinedInput label="Benefits" />}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxWidth: '100%', // Ensures dropdown width matches form
                        },
                      },
                    }}
                    sx={{ width: '100%' }} // Ensures select box width matches form
                  >
                    {benefits.map((benefit) => (
                      <MenuItem key={benefit.id} value={benefit.id}>
                        {benefit.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.benefits && (
                    <FormHelperText>{errors.benefits.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {watch('benefits') === '51d25808-371b-4ba3-9d85-a16e3a5793be' && (
            <Grid item xs={12}>
              <Controller
                name="otherBenefits"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={t('OPPORTUNITY.OTHERBENIFITS')}
                    // error={!!errors.otherBenefits}
                    // helperText={errors.otherBenefits?.message}
                  />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Controller
              name="max_salary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('OPPORTUNITY.STIPEND')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="work_nature"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.work_nature}>
                  <InputLabel>
                    {t('OPPORTUNITY.WORK_EXPERIENCE_NATURE')}
                  </InputLabel>
                  <Select
                    {...field}
                    label={t('OPPORTUNITY.WORK_EXPERIENCE_NATURE')}
                  >
                    {['Remote', 'On-site', 'Hybrid', 'Work from Office'].map(
                      (role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  {errors.work_nature && (
                    <FormHelperText>
                      {errors.work_nature.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.skills}>
                  <InputLabel>{t('OPPORTUNITY.SKILLS')}</InputLabel>
                  <Select
                    {...field}
                    multiple
                    input={<OutlinedInput label="Skills" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const skill = skills.find((s) => s.id === value);
                          return skill ? (
                            <Chip key={value} label={skill.name} />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {skills.map((skill) => (
                      <MenuItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.skills && (
                    <FormHelperText>{errors.skills.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="no_of_candidates"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  label={t('OPPORTUNITY.NUMBER_OF_VACUNCIES')}
                  error={!!errors.no_of_candidates}
                  helperText={errors.no_of_candidates?.message}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              )}
            />
          </Grid>
        </Grid>

        <Stack
          borderTop={'1px solid #D0C5B4'}
          p={'16px'}
          position={'sticky'}
          width={'100%'}
          bottom={0}
          bgcolor={'white'}
          zIndex={9999999}
        >
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={isLoading}
              sx={{ padding: '10px', fontWeight: 500 }}
            >
              {t('OPPORTUNITY.CANCEL')}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ padding: '10px', fontWeight: 500 }}
          >
            {isLoading ? 'Saving...' : 'Add'}
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

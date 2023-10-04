

import { useState, useMemo, useEffect } from 'react';
import { itemsList } from '../../constants/itemsList';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const noCategory = 'no-category';
const apply_to_arr = [
    { name: 'Apply to all items in collection', value: 'all' },
    { name: 'Apply to specific items', value: 'some' },
];


const validateSchema = Yup.object().shape({
    name: Yup.string().required('Tax Name is required'),
    rate: Yup.number()
        .required('Rate is required')
        .min(1, 'Rate must be at least 1')
        .max(100, 'Rate must be at most 100'),
    applicable_items: Yup.array().min(1, 'Select at least one item'),
});

export const useHome = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            rate: '',
            applied_to: 'some',
            applicable_items: [],
        },
        validationSchema: validateSchema,
        onSubmit: (values, { resetForm }) => {
            if (values.applicable_items.length === 0) {
                formik.setFieldError('applicable_items', 'Select at least one item');
            } else {
                const details = {
                    ...values,
                    rate: values?.rate / 100
                }
                console.log(details);


            }
        },
    });

    const [taxDetails, setTaxDetails] = useState({
        applicable_items: [],
        applied_to: 'some',
    });

    const groupedItems = useMemo(() => {
        const grouped = {};

        itemsList.forEach((item) => {
            const categoryName = item?.category ? item?.category?.id : noCategory;
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName]?.push(item);
        });

        return grouped;
    }, [itemsList?.length]);

    const allItemIds = useMemo(() => {
        let allIds = [];
        for (const category in groupedItems) {
            for (const item of groupedItems[category]) {
                allIds.push(item.id);
            }
        }
        return allIds;
    }, [itemsList?.length]);

    const handleApplyTo = (value) => {
        let extractedIds = [];
        if (value === 'all') {
            extractedIds = allItemIds;
        }
        setTaxDetails({
            ...taxDetails,
            applied_to: value,
            applicable_items: extractedIds,
        });
    };

    const handleCategoryChange = (evt, categoryId) => {
        const isChecked = evt?.target?.checked;
        let updateIds = taxDetails?.applicable_items || [];
        const itemIds = groupedItems?.[categoryId]?.map((item) => item.id) || [];
        if (isChecked) {
            itemIds?.forEach((item) => {
                if (!updateIds?.includes(item)) {
                    updateIds.push(item);
                }
            });
        } else {
            updateIds = updateIds?.filter((id) => !itemIds?.includes(id)) || [];
        }

        setTaxDetails({
            ...taxDetails,
            applicable_items: updateIds,
            applied_to:
                updateIds?.length === allItemIds?.length ? 'all' : 'some',
        });
    };

    const handleItemChange = (itemId) => {
        const applicable_items = taxDetails?.applicable_items;
        let updatedItems = applicable_items?.length ? [...applicable_items] : [];

        if (updatedItems.includes(itemId)) {
            updatedItems = updatedItems.filter((item) => item !== itemId);
        } else {
            updatedItems.push(itemId);
        }

        setTaxDetails({
            ...taxDetails,
            applicable_items: updatedItems,
            applied_to:
                updatedItems?.length === allItemIds?.length ? 'all' : 'some',
        });
    };

    const isCategoryChecked = (categoryId) => {
        let isCategoryMarked = true;
        const catItemIds = groupedItems?.[categoryId]?.map((item) => item.id) || [];

        catItemIds?.forEach((id) => {
            if (!taxDetails?.applicable_items?.includes(id)) {
                return (isCategoryMarked = false);
            }
        });
        return isCategoryMarked;
    };

    useEffect(() => {
        formik.setFieldValue('applicable_items', taxDetails.applicable_items);
    }, [taxDetails.applicable_items]);

    useEffect(() => {
        formik.setFieldValue('applied_to', taxDetails.applied_to);
    }, [taxDetails.applied_to]);



    return {
        formik,
        groupedItems,
        handleCategoryChange,
        taxDetails,
        handleItemChange,
        noCategory,
        isCategoryChecked,
        apply_to_arr,
        handleApplyTo,
    };
};

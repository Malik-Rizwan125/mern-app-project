

import React from 'react';
import { useHome } from './useHome';
import '../../assets/css/style.css';

export default function Home() {
    const {
        formik,
        groupedItems,
        handleCategoryChange,
        taxDetails,
        handleItemChange,
        noCategory,
        isCategoryChecked,
        apply_to_arr,
        handleApplyTo,
    } = useHome();


    return (
        <div>
            <div className="container">
                <div className="form-header">
                    <h2>Add Tax</h2>
                    <span>X</span>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-flex">
                        <input
                            className="large-input"
                            placeholder="Tax Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <div className="error">{formik.errors.name}</div>
                        )}
                        <input
                            placeholder="Rate (%)"
                            type="number"
                            min={1}
                            max={100}
                            name="rate"
                            value={formik.values.rate}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.rate && formik.touched.rate && (
                            <div className="error">{formik.errors.rate}</div>
                        )}
                    </div>
                    <div className="apply-radio">
                        {apply_to_arr?.map((item, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    checked={item?.value === taxDetails?.applied_to || false}
                                    onChange={() => handleApplyTo(item?.value)}
                                />
                                <label className="radio-btn">{item?.name}</label>
                            </div>
                        ))}
                    </div>
                    {Object.keys(groupedItems)?.map((categoryId, idx) => (
                        <div key={idx}>
                            <div className="bg-clr">
                                <input
                                    type="checkbox"
                                    checked={isCategoryChecked(categoryId) || false}
                                    onChange={(e) => handleCategoryChange(e, categoryId)}
                                />
                                <label className="check-box">
                                    {categoryId === noCategory
                                        ? ''
                                        : groupedItems?.[categoryId]?.[0]?.category?.name}
                                </label>
                            </div>
                            <div style={{ marginLeft: 15, marginTop: 8 }}>
                                {groupedItems[categoryId]?.map((item) => (
                                    <div key={item?.id}>
                                        <input
                                            type="checkbox"
                                            checked={taxDetails?.applicable_items?.includes(item?.id) || false}
                                            onChange={() => handleItemChange(item.id)}
                                        />
                                        <label className="check-box">{item?.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {formik.errors.applicable_items && formik?.touched?.applicable_items?.length === 0 && (
                        <div className="error">{formik.errors.applicable_items}</div>
                    )}
                    <div className="apply-btn">
                        <button type="submit">{`Apply Tax to ${taxDetails?.applicable_items?.length
                            } items`}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


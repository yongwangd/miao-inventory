import React from 'react';

const LabelFieldSet = props => { 
		let {label, noMargin, className, labelClassName, success, err, children, ...rest} = props;
		return (
			<div style={{}} {...rest} className={className||''+ ' form-group row '} >
				{
					label&&<label className={labelClassName||'col-2 col-form-label'}>{label}</label>
				}
				<div className="col-10">
					{children}
				</div>	
				{
					success&&
					<span style={{ marginLeft: 104 }}>
						<small className="text-success">{success}</small>
					</span>	
				}
				{
					err &&
					<span style={{ marginLeft: 104 }}>
						<small className="text-danger">{err}</small>
					</span>	
				}
			</div>
		);
	};

export default LabelFieldSet;
